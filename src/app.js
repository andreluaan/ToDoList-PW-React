const express = require('express');
const path = require('path');
const cors = require('cors');
const TarefaRoutes = require('./routes/TarefaRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const ListaRoutes = require('./routes/ListaRoutes');

const app = express();
app.use(cors()); // o front React roda em outra porta (ex: 5173), precisa de CORS liberado
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/auth', AuthRoutes);
app.use('/listas', ListaRoutes);
app.use('/tarefas', TarefaRoutes);

app.get('/api', (_req, res) => {
  res.json({ status: 'ok', mensagem: 'API To-Do List no ar' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});