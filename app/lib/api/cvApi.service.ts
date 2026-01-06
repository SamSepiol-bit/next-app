export interface CVUpdateData {
    cv_document: File;
    cv_document_name: string;
}

export interface CVUpdateResponse {
    success: boolean;
    message: string;
    data?: {
        cv_document: string;
        cv_document_name: string;
        updated_at: string;
    };
}

export async function updateCandidateCV(cvData: CVUpdateData): Promise<CVUpdateResponse> {
    try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        const formData = new FormData();
        formData.append('cv_document', cvData.cv_document);
        formData.append('cv_document_name', cvData.cv_document_name);

        const response = await fetch(
            `${API_BASE_URL}/api/candidate-cv-management/cv`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token.replace(/['"]+/g, '').trim()}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('CV updata error:', error);
        throw error;
    }
}