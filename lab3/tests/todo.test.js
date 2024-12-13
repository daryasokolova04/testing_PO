const { test, expect } = require('@playwright/test');


test('User cannot register with invalid email and password', async ({ page }) => {
  await page.goto('https://to-do2-f439d9.netlify.app');
	await page.click('button.auth__btn >> text=Sign Up');
  
  await page.fill('input[name="email"]', 'user');
  await page.fill('input[name="password1"]', '123');
  await page.fill('input[name="password2"]', '123');

  await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  await expect(page.locator('text=Password should be at least 6 letters')).toBeVisible();
});

test('User can register with valid data', async ({ page }) => {
  await page.goto('https://to-do2-f439d9.netlify.app');
	await page.click('button.auth__btn >> text=Sign Up');

  await page.fill('input[name="email"]', 'user0@example.com');
  await page.fill('input[name="password1"]', 'Test1234');
  await page.fill('input[name="password2"]', 'Test1234');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('https://to-do2-f439d9.netlify.app/home');
});

test('User can login with valid data', async ({ page }) => {
  await page.goto('https://to-do2-f439d9.netlify.app/auth');
  await page.click('button.auth__btn >> text=Login');

  await page.fill('input[name="email"]', 'user0@example.com');
  await page.fill('input[name="password"]', 'Test1234');
  await page.click('button[type="submit"]');

	await expect(page).toHaveURL('https://to-do2-f439d9.netlify.app/home');
});

test('User cannot login with invalid data', async ({ page }) => {
  await page.goto('https://to-do2-f439d9.netlify.app/auth');
  await page.click('button.auth__btn >> text=Login');

  await page.fill('input[name="email"]', 'user0@example.com');
  await page.fill('input[name="password"]', '123');
  await page.click('button[type="submit"]');

	await expect(page.locator('text=Firebase: Error (auth/wrong-password).')).toBeVisible();
});

test('User can create a task', async ({ page }) => {
  await page.goto('https://to-do2-f439d9.netlify.app');
  await page.click('button.auth__btn >> text=Login');

  await page.fill('input[name="email"]', 'user0@example.com');
  await page.fill('input[name="password"]', 'Test1234');
  await page.click('button[type="submit"]');

	await page.click('button.open');
  await page.fill('input[name="title"]', 'First Task');
	await page.fill('textarea[name="description"]', 'First Task Description');
  await page.click('button.add');

  await expect(page.locator('text=First Task')).toBeVisible();
	await expect(page.locator('text=First Task Description')).toBeVisible();
});

test('User can delete a task', async ({ page }) => {
  await page.goto('https://to-do2-f439d9.netlify.app');
  await page.click('button.auth__btn >> text=Login');

  await page.fill('input[name="email"]', 'user0@example.com');
  await page.fill('input[name="password"]', 'Test1234');
  await page.click('button[type="submit"]');

	await page.click('button.open');
  await page.fill('input[name="title"]', 'Task to Delete');
	await page.fill('textarea[name="description"]', 'Description to Delete');
  await page.click('button.add');

	await page.click('ul.list li.item:last-child button.item__btn');

  await expect(page.locator('text=Task to Delete')).not.toBeVisible();
	await expect(page.locator('text=Description to Delete')).not.toBeVisible();
});

test('User can logout', async ({ page }) => {
  await page.goto('https://to-do2-f439d9.netlify.app');
  await page.click('button.auth__btn >> text=Login');

  await page.fill('input[name="email"]', 'user0@example.com');
  await page.fill('input[name="password"]', 'Test1234');
  await page.click('button[type="submit"]');

  await page.click('button.logout'); 

  await expect(page).toHaveURL('https://to-do2-f439d9.netlify.app/auth');
});

