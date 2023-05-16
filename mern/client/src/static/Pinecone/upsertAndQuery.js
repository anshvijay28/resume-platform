const { PineconeClient } = require("@pinecone-database/pinecone");

const fetch = require("cross-fetch");
const resumes = require("./resumeObjects.json");
let inputs = resumes.map(resume => resume.rawText);
const OPEN_AI_API_KEY = "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";
const PINECONE_API_KEY = "f3a8e1b4-0553-4861-95ef-a793c0fa3baa";

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
			let input = inputs.shift();                         // <------- tbh this a bunch of bullshit
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
		} catch(error) {
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
	const index = pinecone.Index("resumes");
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

export async function query(searchEntry) {
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
	const index = pinecone.Index("resumes");
	const queryRequest = {
		vector: userVector,
		topK: 10,
		includeValues: false,
		includeMetadata: true,
	};
	const queryResponse = await index.query({ queryRequest });
	let matches = queryResponse.matches;
	let matchingNames = matches.map(match=>match.metadata.name)
	//console.log(matchingNames);
	return matchingNames 
}


