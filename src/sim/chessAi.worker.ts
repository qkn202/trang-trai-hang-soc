import { ChessMove, ChessWorkerSearchPayload, WizardChessEngine } from './puzzleArcadeEngine';

export interface ChessWorkerRequestMessage {
  reqId: number;
  mode?: 'ai' | 'best_white';
  payload: ChessWorkerSearchPayload;
}

export interface ChessWorkerResponseMessage {
  reqId: number;
  mode?: 'ai' | 'best_white';
  move: ChessMove | null;
}

const workerScope = self as unknown as {
  onmessage: ((ev: MessageEvent<ChessWorkerRequestMessage>) => void) | null;
  postMessage: (msg: ChessWorkerResponseMessage) => void;
};

workerScope.onmessage = (ev: MessageEvent<ChessWorkerRequestMessage>) => {
  const { reqId, mode = 'ai', payload } = ev.data;
  const move =
    mode === 'best_white'
      ? WizardChessEngine.computeBestWhiteMoveFromPayload(payload)
      : WizardChessEngine.computeAiMoveFromPayload(payload);
  workerScope.postMessage({ reqId, mode, move });
};
