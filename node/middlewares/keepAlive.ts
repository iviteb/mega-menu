export function keepAlive(ctx: Context) {
  ctx.set('Cache-Control', 'no-store')
  ctx.status = 200
}
