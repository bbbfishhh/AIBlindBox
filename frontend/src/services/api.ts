
// API service for backend communication
// const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// 姓名生成盲盒接口
export interface NameImagesRequest {
  name: string;
}

export interface BlindBoxData {
  id: number;
  imagery1: string;
  imagery2: string;
  image_url: string;
}

export type NameImagesResponse = BlindBoxData[];

// 生成反馈报告接口
export interface FeedbackRequest {
  imagery1: string;
  imagery2: string;
}

export interface FeedbackResponse {
  feedback: string;
}

// 生成新图片接口
export interface GenerateImageRequest {
  imagery1: string;
  imagery2: string;
}

export interface ImageResponse {
  images: string[];
}

// 检查API连接
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/docs`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
};

// 根据姓名生成盲盒数据
export const generateNameImages = async (name: string): Promise<NameImagesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate_name_images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('生成盲盒API端点未找到');
      } else if (response.status >= 500) {
        throw new Error('服务器内部错误，请稍后重试');
      } else {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('无法连接到服务器，请检查网络连接');
    }
    throw error;
  }
};

// 生成反馈报告
export const generateFeedback = async (imagery1: string, imagery2: string): Promise<FeedbackResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate_feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imagery1, imagery2 }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('生成反馈API端点未找到');
      } else if (response.status >= 500) {
        throw new Error('反馈生成服务器错误，请稍后重试');
      } else {
        throw new Error(`反馈生成失败: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('无法连接到反馈生成服务，请检查网络连接');
    }
    throw error;
  }
};

// 根据选择的意象生成新图片
export const generateImageFromImageries = async (imagery1: string, imagery2: string): Promise<ImageResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate_image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imagery1, imagery2 }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('图片生成API端点未找到');
      } else if (response.status >= 500) {
        throw new Error('图片生成服务器错误，请稍后重试');
      } else {
        throw new Error(`图片生成失败: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('无法连接到图片生成服务，请检查网络连接');
    }
    throw error;
  }
};
