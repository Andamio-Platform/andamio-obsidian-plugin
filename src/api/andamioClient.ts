import { AndamioModuleResponse } from '../types/andamio';
import { requestUrl } from 'obsidian';

/**
 * Client for interacting with Andamio API
 */
export class AndamioClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash if present
	}

	/**
	 * Fetch lessons for a specific module
	 * @param courseNftPolicyId - The course NFT policy ID
	 * @param moduleCode - The module code (e.g., "101")
	 * @returns Module data with lessons
	 */
	async getLessonsByModule(
		courseNftPolicyId: string,
		moduleCode: string
	): Promise<AndamioModuleResponse> {
		const url = `${this.baseUrl}/api/openapi/lessons/by-module/${courseNftPolicyId}/${moduleCode}`;

		try {
			const response = await requestUrl({
				url,
				method: 'GET',
			});

			if (response.status !== 200) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response.json as AndamioModuleResponse;
		} catch (error) {
			console.error('Andamio API error:', error);
			throw new Error(`Failed to fetch lessons: ${error.message}`);
		}
	}

	/**
	 * Update the base URL
	 */
	setBaseUrl(baseUrl: string): void {
		this.baseUrl = baseUrl.replace(/\/$/, '');
	}
}
