import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://wc-react-todo-app.netlify.app/');
});

async function addTask(page, title, status, toSubmit = true) {
  await page.locator('button[type="button"]:has-text("Add Task")').click();
  await page.fill('input[id="title"]', title);
  await page.getByLabel('Status').selectOption(status);
  if (toSubmit) {
    await page.locator('button[type="submit"]:has-text("Add Task")').click();
  } else {
    await page.locator('button:has-text("Cancel")').click();
  }
}

async function editTask(page, task, newTitle, newStatus) {
  const editButton = task.getByRole('button').nth(-1);
  await editButton.click();
  await page.fill('input[id="title"]', newTitle);
  await page.getByLabel('Status').selectOption(newStatus);
  await page.locator('button[type="submit"]:has-text("Update Task")').click();
}

async function deleteTask(page, i) {
  const deleteButton = page.getByRole("button").nth((i - 1) * 2 + 1)
  await deleteButton.click();
}

async function deleteAllTasks(page) {
  const wrapper = page.locator('div.app_content__wrapper__Mm7EF')
  const count = await wrapper.childElementCount;
  for (let i = 0; i < count; i++) {
    await deleteTask(page, i)
  }
}

async function expectTextVisible(page, text, isVisible = true) {
  const textLocator = page.locator(`text=${text}`);
  if (isVisible) {
    await expect(textLocator).toBeVisible();
  } else {
    await expect(textLocator).not.toBeVisible();
  }
}


// Тест на добавление задачи
test('should add a new task', async ({ page }) => {
  const firstTask = 'First Task'
  const taskStatus = 'Incomplete'

  await addTask(page, firstTask, taskStatus)
  await expectTextVisible(page, firstTask)
});

// Тест на добавление пустой задачи
test('should not add an empty task', async ({ page }) => {
  const emptyTask = ''
  const taskStatus = 'Incomplete'
  const errorMessage = 'Please enter a title'

  await addTask(page, emptyTask, taskStatus)
  await expectTextVisible(page, errorMessage)
});

// Тест на отмену добавления задачи
test('should cancel adding a task', async ({ page }) => {
  const secondTask = 'Second Task'
  const taskStatus = 'Incomplete'

  await addTask(page, secondTask, taskStatus, false)
  await expectTextVisible(page, secondTask, false)
});

// Тест на редактирование задачи
test('should edit an existing task', async ({ page }) => {
  const originalTask = "Task to Edit";
  const updatedTask = "Task after Editing";
  const originalStatus = "Incomplete"
  const newStatus = "Completed"
  await addTask(page, originalTask, originalStatus)

  const task = page.locator('div.todoItem_item__fnR7B').nth(-1)
  await editTask(page, task, updatedTask, newStatus)

  await expectTextVisible(page, originalTask, false)
  await expectTextVisible(page, updatedTask, true)
});


// Тест на удаление задачи
test('should delete a task', async ({ page }) => {
  const taskToDelete = 'Task to be deleted';

  await addTask(page, taskToDelete, 'Incomplete')
  await deleteTask(page, 1)

  await expectTextVisible(page, taskToDelete, false)
});


// Тест на фильтрацию задач
test('should filter tasks by status', async ({ page }) => {
  const incompleteTask = 'Incomplete Task';
  const completedTask = 'Completed Task';
  const incompleteStatus = 'Incomplete'
  const completedStatus = 'Completed'

  await deleteAllTasks(page)
  await addTask(page, incompleteTask, incompleteStatus)
  await addTask(page, completedTask, completedStatus)

  await page.click('select#status');
  await page.locator('select#status').selectOption('Completed');

  await expectTextVisible(page, incompleteTask, false)
  await expectTextVisible(page, completedTask)
});


// Тест на выполнение задачи
test('should not see task if completed', async ({ page }) => {
  const taskToCompelete = 'Task to Complete';
  const taskNotToComplete = 'Task not to Complete';
  const incompleteStatus = 'Incomplete'

  await deleteAllTasks(page)
  await addTask(page, taskNotToComplete, incompleteStatus)
  await addTask(page, taskToCompelete, incompleteStatus)

  await page.click('select#status');
  await page.locator('select#status').selectOption(incompleteStatus);

  const task = page.locator('div.todoItem_item__fnR7B').nth(-1)
  await task.locator('div.todoItem_svgBox__z1vm6').click()

  await expectTextVisible(page, taskToCompelete, false)
  await expectTextVisible(page, taskNotToComplete)
});