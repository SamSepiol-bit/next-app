

export interface CandidateProfile {
  id: number;
  uuid: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  phone: string;
  whatsapp_number: string;
  status: string;
  blacklisted: boolean;
  kyc_status: string;
  referral_code: string;
  is_cv_published: boolean;
  cv_updated_at: string | null;
  created_at: string;
  updated_at: string;
  full_name: string;
  avatar: string;
  country_name: string;
  is_online: boolean;
  available_free_jobs_count: number;
  referral_count: number;
  country_id?: string;
  gender?: string;
  dob?: string;
}

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  country_id: string;
  gender: string;
  dob: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  candidate?: T;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Get base URL
const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jobsformycv.enricharcane.info';
};

// Fetch candidate profile
export const fetchCandidateProfile = async (): Promise<CandidateProfile> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${getBaseUrl()}/api/candidate-profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }

  const data: ApiResponse<CandidateProfile> = await response.json();
  
  // Handle different response formats
  if (data.candidate) {
    return data.candidate;
  } else if (data.data) {
    return data.data;
  } else {
    throw new Error('Invalid response format');
  }
};

// Update candidate profile
export const updateCandidateProfile = async (profileData: UpdateProfileData): Promise<CandidateProfile> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const formData = new FormData();
  
  // Append all fields to FormData
  Object.entries(profileData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch(`${getBaseUrl()}/api/candidate-profile`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update profile: ${response.status}`);
  }

  const data: ApiResponse<CandidateProfile> = await response.json();
  
  if (data.candidate) {
    return data.candidate;
  } else if (data.data) {
    return data.data;
  } else {
    throw new Error('Invalid response format');
  }
};

// Update candidate image
export const updateCandidateImage = async (imageFile: File): Promise<CandidateProfile> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${getBaseUrl()}/api/candidate-profile/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update image: ${response.status}`);
  }

  const data: ApiResponse<CandidateProfile> = await response.json();
  
  if (data.candidate) {
    return data.candidate;
  } else if (data.data) {
    return data.data;
  } else {
    throw new Error('Invalid response format');
  }
};

// Delete candidate profile
export const deleteCandidateProfile = async (): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${getBaseUrl()}/api/candidate-profile`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete profile: ${response.status}`);
  }

  return true;
};