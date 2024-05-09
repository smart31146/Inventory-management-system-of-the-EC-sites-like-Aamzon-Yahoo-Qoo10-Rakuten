import { Firestore, WriteResult, getFirestore } from "firebase-admin/firestore";
import { ExecProgressConverter } from "./converter";
import { ExecProgressStatus, IExecProgress, IExecProgressWithId } from "./schema";

export const collectionPath = 'exec-progress';

export class ExecProgressRepository{
    private readonly db : Firestore;
    private readonly converter : ExecProgressConverter;

    constructor(){
        this.db = getFirestore();
        
        try {
            this.db.settings({ ignoreUndefinedProperties: true });
        } catch (error) {
            console.log("Firestore has already been initialized.");
        }

        // コンバータの取得
        this.converter = new ExecProgressConverter();
    }

    public getExecProgressPath (execId: string){
        return `${collectionPath}/${execId}`
    }

    public async getOne(query: { execId: string; }) : Promise<IExecProgressWithId | undefined> 
    {
        const querySnapshot = await this.db
          .doc(this.getExecProgressPath(query.execId))
          .withConverter(this.converter)
          .get();

        if (!querySnapshot.exists) 
        {
            return undefined;
        }

        // 取得データを返却
        return { 
            ...querySnapshot.data()!,
            id : querySnapshot.id
        }
    }

    public async create(data: IExecProgress) : Promise<void> 
    {
        // Firestoreのコレクションを取得
        const found = await this.getOne({execId : data.execId});
        
        if(found) {
            throw new Error('Document already exists');
        }

        // Firestoreにデータを追加
        await this.db.doc(this.getExecProgressPath(data.execId)).withConverter(this.converter).set(data);
    }

    public async updateStatus(execId: string, status: ExecProgressStatus, message?: string) : Promise<WriteResult> 
    {
        // Firestoreのコレクションを取得
        const found = await this.getOne({execId : execId});
        
        if(found) {
            return this.db.doc(this.getExecProgressPath(execId)).withConverter(this.converter).update({
                status: status,
                message: message || ''
            })
        }
        throw new Error('Document not exists');
    }

}
