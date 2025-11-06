import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    
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

export function deactivate() {}