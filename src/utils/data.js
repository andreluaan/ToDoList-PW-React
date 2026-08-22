/**
 * Retorna a data de HOJE no fuso horário local do servidor, no formato YYYY-MM-DD.
 */
function hojeISO() {
  const agora = new Date();
  const offsetMs = agora.getTimezoneOffset() * 60000;
  const local = new Date(agora.getTime() - offsetMs);
  return local.toISOString().slice(0, 10);
}

module.exports = { hojeISO };