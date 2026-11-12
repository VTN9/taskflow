import { expect, test } from '@playwright/test'

test('crea, completa y comparte una tarea', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible()

  await page.getByRole('button', { name: 'Nueva tarea' }).click()
  await page.getByLabel('Título').fill('Comprar pan')
  await page.getByRole('button', { name: 'Añadir tarea' }).click()
  await expect(page.getByText('Comprar pan')).toBeVisible()

  await page.getByRole('checkbox', { name: 'Completar Comprar pan' }).check()
  await expect(page.getByText('Comprar pan')).toHaveClass(/line-through/)

  await page.getByRole('button', { name: 'Compartir' }).click()
  await page.getByRole('button', { name: 'Generar enlace' }).click()
  await expect(page.getByLabel('Enlace para compartir')).toHaveValue(/\?share=/)
})

test('crea una lista nueva y filtra tareas', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('Nombre de la nueva lista').fill('Trabajo')
  await page.getByRole('button', { name: 'Añadir lista' }).click()
  await expect(page.getByRole('heading', { name: 'Trabajo' })).toBeVisible()

  await page.getByRole('button', { name: 'Nueva tarea' }).click()
  await page.getByLabel('Título').fill('Revisar PR')
  await page.getByRole('button', { name: 'Añadir tarea' }).click()

  await page.getByLabel('Buscar tareas').fill('inexistente')
  await expect(page.getByText(/no hay tareas con estos filtros/i)).toBeVisible()

  await page.getByLabel('Buscar tareas').fill('Revisar')
  await expect(page.getByText('Revisar PR')).toBeVisible()
})
