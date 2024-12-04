import { GraphQLError } from "graphql";
import { createJob, deleteJob, getCompanyJobs, getJob, getJobs, updateJob } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id);

      if (!company) throw notFoundError("Could not find company with id: " + id);

      return company
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);

      if (!job) throw notFoundError("Could not find job with id: " + id);

      return job;
    },
    jobs: () => getJobs()
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }) => {
      const companyId = "FjcJCHJALA4i";
      return createJob({ companyId, title, description });
    },
    deleteJob: (_root, { id }) => deleteJob(id),
    updateJob: (_root, { input }) => updateJob(input)
  },

  Company: {
    jobs: (company) => getCompanyJobs(company.id)
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt)
  }
};

function toIsoDate(value) {
    return value.slice(0, "yyyy-mm-dd".length);
}

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" }
  });
}