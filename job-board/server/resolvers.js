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
    jobs: (_, { limit, offset }) => getJobs(limit, offset)
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const job = await deleteJob(id, user.companyId)
      if (!job) {
        throw notFoundError("This job is not found in your company")
      }
      return job;
    },
    updateJob: async (_root, { input }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const job = updateJob(input, user.companyId);
      if (!job) {
        throw notFoundError("This job is not found in your company")
      }
      return job;
    }
  },

  Company: {
    jobs: (company) => getCompanyJobs(company.id)
  },

  Job: {
    company: (job, _args, { companyLoader }) => companyLoader.load(job.companyId),
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

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" }
  });
}