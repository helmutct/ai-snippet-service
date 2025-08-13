import express from 'express';
import snippetService from '../services/snippet.service';
import { CreateSnippetSchemaWithAI, ParamsSchema, QueryParamsSchema } from '../schemas/snippet.schema';

const router = express.Router();

class SnippetsController {
  
  async createSnippet(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const validatedData = CreateSnippetSchemaWithAI.parse(req.body);
      const snippet = await snippetService.createSnippet(validatedData);
      res.status(201).json(snippet);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.issues[0]?.message || 'Invalid input'
        });
      }
      next(error);
    }
  }

  async getSnippetById(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const validatedParams = ParamsSchema.parse(req.params);
      const snippet = await snippetService.getSnippetById(validatedParams.id);
      res.json(snippet);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Invalid snippet ID format'
        });
      }
      if (error.message === 'Snippet not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Snippet not found'
        });
      }
      next(error);
    }
  }

  async getAllSnippets(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const validatedQuery = QueryParamsSchema.parse(req.query);
      const snippets = await snippetService.getAllSnippets(validatedQuery);
      res.json(snippets);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.issues[0]?.message || 'Invalid query parameters'
        });
      }
      next(error);
    }
  }

  async deleteSnippet(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const validatedParams = ParamsSchema.parse(req.params);
      const snippet = await snippetService.deleteSnippet(validatedParams.id);
      res.json({
        message: 'Snippet deleted successfully',
        snippet
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Invalid snippet ID format'
        });
      }
      if (error.message === 'Snippet not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Snippet not found'
        });
      }
      next(error);
    }
  }
}

const controller = new SnippetsController();

router.post('/', controller.createSnippet.bind(controller));
router.get('/:id', controller.getSnippetById.bind(controller));
router.get('/', controller.getAllSnippets.bind(controller));
router.delete('/:id', controller.deleteSnippet.bind(controller));

export default router;