const ROOT_FOLDER_PATH = 'C:/Users/maksymilian.stachowi/Downloads/test/';
const rootFolder: Folder = new Folder(ROOT_FOLDER_PATH);

const files: (Folder|File)[] = rootFolder.getFiles('');

for (let i = files.length; i >= 0; i -= 1) {
  const element: Folder | File = files[i];

  if (element instanceof File) {
    const year: number = element.modified.getFullYear();

    $.writeln(`${i} of ${files.length} remaining, current file ${element.displayName}`);

    if (!Folder(`${ROOT_FOLDER_PATH}${year}`).exists) {
      const yearFolder: Folder = new Folder(`${ROOT_FOLDER_PATH}${year}`);
      yearFolder.create();
      $.writeln(`Created: ${yearFolder.path}`);
    }

    element.copy(`${ROOT_FOLDER_PATH}${year}/${element.displayName}`);
    element.remove();
  }
}
