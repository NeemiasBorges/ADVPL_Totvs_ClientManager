import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = `${environment.apiUrl}/chatbot`;

  constructor(private http: HttpClient) {}

  sendMessage(message: string, context: ChatMessage[] = []): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/message`, {
      message,
      context,
      model: 'mistral-7b'
    });
  }
}