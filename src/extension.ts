import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';

/**
 Активирует расширение при загрузке в VS Code
 
 Параметры:
 context (vscode.ExtensionContext) - контекст расширения VS Code
 
 Возвращаемое значение:
 void
 */
export function activate(context: vscode.ExtensionContext) {
    /**
     Сохраняет выделенный текст в файл и открывает Telegram для отправки
     
     Параметры: 
     Не принимает явных параметров

	 Пример вызова:
     // Выделение кода в редакторе + сочетание клавиш Ctrl+Shift+T

     Логика работы:
     1. Проверяет наличие активного редактора и выделенного текста
     2. Сохраняет текст в файл snippet.cpp в папке Download
     3. Запускает Telegram Desktop
     4. Показывает уведомление о результате
     */
    let disposable = vscode.commands.registerCommand('telegram-snippet.saveSnippet', async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('Нет активного редактора!');
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        
        if (!selectedText) {
            vscode.window.showWarningMessage('Не выделен текст!');
            return;
        }

        try {
            const downloadsPath = path.join(os.homedir(), 'Downloads', 'snippet.cpp');
            
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(downloadsPath),
                Buffer.from(selectedText, 'utf8')
            );

            const telegramPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Telegram Desktop', 'Telegram.exe');
			
			exec(`"${telegramPath}"`, (error) => {
                if (error) {
                    vscode.window.showInformationMessage(
                        'Файл snippet.cpp сохранен в Загрузки. Теперь необходимооткрыть Telegram вручную.'
                    );
                } else {
                    vscode.window.showInformationMessage(
                        'Файл сохранен и Telegram открыт. Отправьте созданный snippet.cpp'
                    );
                }
            });

        } catch (error) {
            vscode.window.showErrorMessage('Ошибка при сохранении файла: ' + error);
        }
    });

    context.subscriptions.push(disposable);
}

/**
 Деактивирует расширение при выгрузке из VS Code
 
 Возвращаемое значение:
 void
 */
export function deactivate() {}