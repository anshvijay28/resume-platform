import json 
import numpy as np 

raw_text_f = open("./categoryJson/rawText.json")
raw_text_embeddings_f = open('./categoryEmbeddings/rawTextEmbeddings.json')
positions_embeddings_f = open('./categoryEmbeddings/positionsEmbeddings.json')
organizations_embeddings_f = open('./categoryEmbeddings/organizationsEmbeddings.json')
job_description_embeddings_f = open('./categoryEmbeddings/jobDescriptionEmbeddings.json')
skills_embeddings_f = open('./categoryEmbeddings/skillsEmbeddings.json')
majors_embeddings_f = open('./categoryEmbeddings/majorsEmbeddings.json')
names_embeddings_f = open('./categoryEmbeddings/namesEmbeddings.json')

raw_text = json.load(raw_text_f)
raw_text_embeddings = json.load(raw_text_embeddings_f)
positions_embeddings = json.load(positions_embeddings_f)
organizations_embeddings = json.load(organizations_embeddings_f)
job_description_embeddings = json.load(job_description_embeddings_f)
skills_embeddings = json.load(skills_embeddings_f)
majors_embeddings = json.load(majors_embeddings_f)
names_embeddings = json.load(names_embeddings_f)

def getAverageVector(embeddings):
    j = 0
    embedding_length = len(embeddings[0]["values"])
    num_resumes = len(raw_text_embeddings)

    avgVector = np.zeros((num_resumes, embedding_length))

    for i, resume in enumerate(raw_text_embeddings):
        count = 0
        while j < len(embeddings) and embeddings[j]["id"] == resume["id"]:
            avgVector[i] += np.array(embeddings[j]["values"])
            count += 1
            j += 1
        if count > 0:
            avgVector[i] /= count 
    return avgVector
    # return np.round(avgVector, 10)

# these are all np.array's
averaged_position_embeddings = getAverageVector(positions_embeddings)
averaged_organization_embeddings = getAverageVector(organizations_embeddings)
averaged_job_description_embeddings = getAverageVector(job_description_embeddings)
averaged_skills_embeddings = getAverageVector(skills_embeddings)
extracted_raw_text_embeddings = np.array([e["values"] for e in raw_text_embeddings])
extracted_majors_embeddings = np.array([e["values"] for e in majors_embeddings])
extracted_names_embeddings = np.array([e["values"] for e in names_embeddings])

def assign_weights(a=0.0, b=0.0, c=0.0, d=0.0, e=0.0, f=0.0, g=0.0):
    return np.round((a * averaged_position_embeddings +  \
           b * averaged_organization_embeddings + \
           c * averaged_job_description_embeddings + \
           d * averaged_skills_embeddings + \
           e * extracted_raw_text_embeddings + \
           f * extracted_majors_embeddings + \
           g * extracted_names_embeddings), 10).tolist()
# position, name, major, company most optimal 
averaged_embeddings = assign_weights(0.25, 0.20, 0.02, 0.03, 0.05, 0.25, 0.20)
averaged_embeddings_with_metadata = []

for i, average_embedding in enumerate(averaged_embeddings):
    averaged_embedding_object = {
        "id": raw_text[i]["_id"],
        "metadata": {
            "name": raw_text[i]["firstName"] + " " + raw_text[i]["lastName"]
        },
        "values": average_embedding,
    }
    averaged_embeddings_with_metadata.append(averaged_embedding_object)

with open("weightedEmbeddings.json", "w") as outfile:
    outfile.write(json.dumps(averaged_embeddings_with_metadata))


raw_text_f.close()
raw_text_embeddings_f.close()
positions_embeddings_f.close()
organizations_embeddings_f.close()
job_description_embeddings_f.close()
skills_embeddings_f.close()
majors_embeddings_f.close()
names_embeddings_f.close()


