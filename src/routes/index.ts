import { Router } from 'express';
import Onu from '../services/getOnuInformation';
import dataProcess from '../utils/dataProcess';

const routes = Router();
routes.get('/', async (request, response) => {
  try {
    await Onu(1, `FHTT11a4a518`).then(resposta => {
      const data = resposta;
      const onuInfo = dataProcess(data);

      response.json(onuInfo);
    });
  } catch (err) {
    response.status(404).json({ error: 'ocorreu um erro' });
  }
});
routes.post('/', async (request, response) => {
  const { olt, fhtt } = request.body;
  try {
    const data = await Onu(Number(olt), fhtt);
    const onuInfo = dataProcess(data);

    response.json(onuInfo);
  } catch (err) {
    response.status(404).json({ error: 'ocorreu um erro' });
  }
});

export default routes;
