import { ApiResponse, ApiError, PaginatedResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<T>(response);
  }

  /**
   * File upload with progress tracking
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText) as ApiError;
            reject(new Error(error.message));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseUrl}${endpoint}`);
      xhr.send(formData);
    });
  }

  /**
   * SSE streaming for chat
   */
  streamChat(
    endpoint: string,
    body: { paperIds: string[]; documentIds: string[]; message: string },
    callbacks: {
      onChunk: (content: string) => void;
      onCitation: (citation: { paperId: string; paperTitle: string; section?: string }) => void;
      onDone: () => void;
      onError: (error: string) => void;
    }
  ): AbortController {
    const abortController = new AbortController();

    (async () => {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const error = await response.json();
          callbacks.onError(error.message || 'Stream failed');
          return;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          callbacks.onError('No response body');
          return;
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            callbacks.onDone();
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6);

              if (data === '[DONE]') {
                callbacks.onDone();
                break;
              }

              try {
                const event = JSON.parse(data);

                if (event.type === 'chunk') {
                  callbacks.onChunk(event.content);
                } else if (event.type === 'citation') {
                  callbacks.onCitation({
                    paperId: event.paperId,
                    paperTitle: event.paperTitle,
                    section: event.section,
                  });
                } else if (event.type === 'error') {
                  callbacks.onError(event.message);
                }
              } catch (error) {
                console.error('Failed to parse SSE event:', error);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          callbacks.onError(error.message);
        }
      }
    })();

    return abortController;
  }

  /**
   * Handle response and extract data
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
        code: 'UNKNOWN_ERROR',
      })) as ApiError;

      throw new Error(error.message);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
export default apiClient;
