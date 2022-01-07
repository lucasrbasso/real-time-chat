import { Request, Response } from 'express';
import { CreateMessageService } from '../services/CreateMessageService';

import { io } from '../app';

class CreateMessageController {
  async handle(request: Request, response: Response) {
    const { message } = request.body;
    const { user_id } = request;

    const service = new CreateMessageService();
    try {
      const result = await service.execute(message, user_id);
      return response.json(result);
    } catch (error) {
      return response.json({ error: error.message });
    }
  }
}

export { CreateMessageController };
