import { findByApiKey } from "../repositories/companyRepository";

export async function getCompanyData(apiKey: string) {
    try {
        const company = await findByApiKey(apiKey);

        if (!company) {
            throw "NoCompany";
        } else {
            return company;
        }
    } catch (err) {
        if (err === "NoCompany") {
            throw { code: "NoCompany", message: "Error: company not found" }
        } else {
            throw { code: "ServerProblem", message: err };
        }
    }
}