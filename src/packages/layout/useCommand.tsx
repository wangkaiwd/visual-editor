import { inject } from 'vue';
import { AppContextKey, AppContextProps } from '@/App';
import { deepClone } from '@/utils/helper';
import { dataSource } from '@/config/data';

const commandContext = {
  initial: dataSource,
  currentIndex: -1,
  commands: [] as any[],
};

export const useCommand = () => {
  const { data, changeData } = inject<AppContextProps>(AppContextKey)!;
  const addCommand = () => {
    const { commands, currentIndex } = commandContext;
    const len = commands.length;
    if (currentIndex < len - 1) {
      commandContext.commands = commands.slice(0, currentIndex + 1);
    }
    commandContext.commands.push(deepClone(data.value));
    commandContext.currentIndex++;
  };
  const undo = () => {
    let { commands, currentIndex, initial } = commandContext;
    if (currentIndex === -1) {return;}
    currentIndex = --commandContext.currentIndex;
    const data = commands[currentIndex] || initial;
    changeData(data);
  };
  const redo = () => {
    let { commands, currentIndex } = commandContext;
    const len = commands.length;
    if (currentIndex < len - 1) {
      currentIndex = ++commandContext.currentIndex;
      changeData(commands[currentIndex]);
    }
  };
  const onKeydown = (e: KeyboardEvent) => {
    if (e.metaKey && e.key === 'z') {
      e.shiftKey ? redo() : undo();
    }
  };
  return {
    addCommand,
    undo,
    redo,
    onKeydown
  };
};
