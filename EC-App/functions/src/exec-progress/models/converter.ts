import { FirestoreDataConverter } from "firebase-admin/firestore";
import {  IExecProgress, IExecProgressDocument, IExecProgressWithId } from "./schema";

export class ExecProgressConverter implements FirestoreDataConverter<IExecProgress> {
    toFirestore(entity: IExecProgress) : IExecProgressDocument {
        return {
            createdAt: entity.createdAt,
            status: entity.status ,
            type: entity.type,
            updatedAt: entity.updatedAt,
            message: entity.message || '',
            execId: entity.execId
        }
    }

    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>): IExecProgressDocument {
        const data = snapshot.data();
        return {
            createdAt: data.createdAt,
            status: data.status,
            type: data.type,
            updatedAt: data.updatedAt,
            message: data.message || '',
            id: snapshot.id,
            execId: data.execId,
        }
    }
}
