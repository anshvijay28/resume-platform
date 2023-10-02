const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '../', 'config.env') });

const { PineconeClient } = require("@pinecone-database/pinecone");

const fetch = require("cross-fetch");
const resumes = require("./resumeObjects.json");
const positions = require("./categoryJson/positions.json");
const organizations = require("./categoryJson/organizations.json");
const jobDescriptions = require("./categoryJson/jobDescription.json");
const skills = require("./categoryJson/skills.json");

let inputs = resumes.map((resume) => resume.rawText);
let positionsInputs = positions.map((positionObject) => positionObject.position);
let organizationsInputs = organizations.map((organizationObject) => organizationObject.organization);
let jobDescriptionsInputs = jobDescriptions.map((jobDescriptionObject) => jobDescriptionObject.jobDescription);
let skillsInputs = skills.map((skillObject) => skillObject.skillName);

const OPEN_AI_API_KEY = process.env.OPEN_AI_API;
const PINECONE_API_KEY = process.env.PINECONE_API;

const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getEmbeddings(inputs) {
	let embeddings = [];
	while (inputs.length) {
		//This code chunks up all the rawText of the resumes into arrays of
		//less than 4096 tokens. In this case tokens are just words split by a space (" ").
		//I'm honestly not sure how useful the chunking is, it was just in the tutorial.
		//Also the embeddings model is able to take 8192 tokens now so maybe the tutorial is old??

		let tokenCount = 0;										// <-------
		let batchedInputs = [];									// <-------
		while (inputs.length && tokenCount < 4096) { 			// <-------
			let input = inputs.shift();                         // <------- tbh this a bunch of nonsense
			batchedInputs.push(input);							// <-------
			tokenCount += input.split(" ").length;				// <-------
		}														// <-------

		const apiRequestBody = {
			input: batchedInputs,
			model: "text-embedding-ada-002",
		};
		try {
			const apiRequest = await fetch("https://api.openai.com/v1/embeddings", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + OPEN_AI_API_KEY,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(apiRequestBody),
			});
			const embeddingResult = await apiRequest.json();
			embeddings = embeddings.concat(
				embeddingResult.data.map(entry => entry.embedding)
			);
		} catch (error) {
			console.log("Error: ", error);
		}
	}
	return embeddings;
}

async function processEmbeddings() {
	const embeddings = await getEmbeddings(inputs);
	let vectors = resumes.map((resume, i) => {
		return {
			id: resume._id,
			metadata: {
				name: `${resume.firstName} ${resume.lastName}`
			},
			values: embeddings[i]
		}
	});
	return vectors;
}

async function insertVectors() {
	const pinecone = new PineconeClient();
	await pinecone.init({
		environment: "eu-west1-gcp",
		apiKey: PINECONE_API_KEY,
	});
	const vectors = await processEmbeddings();
	let insertBatches = [];
	const index = pinecone.Index("resumes-index");
	while (vectors.length) {
		let batchedVectors = vectors.splice(0, 250);
		const upsertRequest = {
			vectors: batchedVectors,
			//namespace: "example-namespace",    <------ you only need namespaces if you want to
			//									 <------ separate embeddings into different groups
			//									 <------ within the same index. however in this case
			//									 <------ every vector represents a resume so there
			//									 <------ is no need to partition vectors
		}
		const upsertResponse = await index.upsert({ upsertRequest });
		insertBatches.push(upsertResponse);
	}
	console.log(insertBatches);
}

async function query(searchEntry) {
	const apiRequestBody = {
		input: searchEntry,
		model: "text-embedding-ada-002",
	};

	const apiRequest = await fetch("https://api.openai.com/v1/embeddings", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + OPEN_AI_API_KEY,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(apiRequestBody),
	});
	const embeddingResult = await apiRequest.json();
	let userVector = embeddingResult.data[0].embedding;


	const pinecone = new PineconeClient();
	await pinecone.init({
		environment: "eu-west1-gcp",
		apiKey: PINECONE_API_KEY,
	});
	const index = pinecone.Index("resumes-index");
	const queryRequest = {
		vector: userVector,
		topK: 30,
		includeValues: false,
		includeMetadata: true,
	};
	const queryResponse = await index.query({ queryRequest });
	let matches = queryResponse.matches;
	// console.log(matches);
	// let matchingNames = matches.map(match => [match.metadata.name, match.score]);
	let matchingNames = matches.map(match => match.metadata.name);
	return matchingNames;
}

async function deleteAllVectors() {
	const pinecone = new PineconeClient();
	await pinecone.init({
		environment: "eu-west1-gcp",
		apiKey: PINECONE_API_KEY,
	});
	const index = pinecone.Index("resumes-index");
	await index.delete1({
		deleteAll: true,
		namespace: ""
	});
	//namespace is "" because I never specified a name for the namespace 
}

function getWorkExperienceIndex(fieldName, fileName) {
	client.connect(function (err, db) {
		var _db = db.db("resume_db");
		_db.collection("resumes")
			.find()
			.project({ 
				_id: 1, 
				firstName: "$name.first", 
				lastName: "$name.last", 
				workExperience: 1, 
			})
			.toArray()
			.then(resumes => {
			const fs = require("fs");
			let fieldObjects = [];
			resumes.forEach(resume => {
				resume.workExperience.forEach(experience => {
					if (experience[fieldName] !== "" && experience[fieldName] !== null) {
						fieldObject = {
							_id: resume._id,
							firstName: resume.firstName, 
							lastName: resume.lastName, 
							[fieldName]: experience[fieldName],
						};
						fieldObjects.push(fieldObject);
					}
				});
			});
			const jsonResumeText = JSON.stringify(fieldObjects);
			fs.writeFileSync(fileName, jsonResumeText);
			console.log("Created file");
		}).catch(err => {
		  console.log(err);
		});
	});
}

async function makeEmbeddingFile(input, fileName, inputObjects) {
	const inputEmbeddings = await getEmbeddings(input);
	let vectors = inputObjects.map((inputObject, i) => {
		return {
			id: inputObject._id,
			firstName: inputObject.firstName, 
			lastName: inputObject.lastName, 
			values: inputEmbeddings[i],
		}
	});
	const fs = require("fs");
	const jsonResumeText = JSON.stringify(vectors);
	fs.writeFileSync(fileName, jsonResumeText);
	console.log("Created file");
	return vectors;
}

function getSkills() {
	client.connect(function (err, db) {
		var _db = db.db("resume_db");
		_db.collection("resumes")
			.find()
			.project({ 
				_id: 1, 
				firstName: "$name.first", 
				lastName: "$name.last", 
				skills: 1, 
			})
			.toArray()
			.then(resumes => {
			const fs = require("fs");
			let skillObjects = [];
			resumes.forEach(resume => {
				resume.skills.forEach(skill => {
					if (skill.name !== "" && skill.name !== null) {
						skillObject = {
							_id: resume._id,
							firstName: resume.firstName, 
							lastName: resume.lastName, 
							skillName: skill.name,
						};
						skillObjects.push(skillObject);
					}
				});
			});
			const jsonResumeText = JSON.stringify(skillObjects);
			fs.writeFileSync("skills.json", jsonResumeText);
			console.log("Created file");
		}).catch(err => {
		  console.log(err);
		});
	});

}

// INSERTING NEW VECTORS TO PINECONE
// insertVectors().then().catch()

// DELETING ALL VECTORS IN PINECONE
// deleteAllVectors().then().catch()

// TESTING QUERYING
// query("Ansh").then(res => {
// 	console.log(res);
// }).catch(err => {
// 	console.log(err);
// });

module.exports = { query };
