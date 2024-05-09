import { DocumentData, FieldValue } from 'firebase-admin/firestore';

export enum ExecProgressType  {
    BATCH_EXEC = 'BATCH_EXEC',
    TRANSACTION_EXEC = 'TRANSACTION_EXEC'
}

export enum ExecProgressStatus {
    ERROR = "ERROR",
    DONE = "DONE",
    PROGRESSING = "PROGRESSING"
}

export interface IExecProgressDocument extends DocumentData  { 
    execId: string
    status: ExecProgressStatus /// ExecProgressStatus | FieldValue
    message?: string
    type:  ExecProgressType // ExecProgressType
    createdAt: number
    updatedAt: number
} 

export interface IExecProgress { 
    execId: string
    status: ExecProgressStatus
    message?: string
    type: ExecProgressType
    createdAt: number
    updatedAt: number
}

export interface IExecProgressWithId extends IExecProgress {
    id: string
 }
