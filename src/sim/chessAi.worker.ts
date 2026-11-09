import { ChessWorkerSearchPayload, WizardChessEngine } from './puzzleArcadeEngine';

export interface ChessWorkerRequestMessage {
  reqId: number;
  payload: ChessWorkerSearchPayload;
}

export interface ChessWorkerResponseMessage {
  reqId: number;
  move: ReturnType<typeof WizardChessEngine.computeAiMoveFromPayload>;
}

const workerScope = self as unknown as {
  onmessage: ((ev: MessageEvent<ChessWorkerRequestMessage>) => void) | null;
  postMessage: (msg: ChessWorkerResponseMessage) => void;
};

workerScope.onmessage = (ev: MessageEvent<ChessWorkerRequestMessage>) => {
  const { reqId, payload } = ev.data;
  const move = WizardChessEngine.computeAiMoveFromPayload(payload);
  workerScope.postMessage({ reqId, move });
};
