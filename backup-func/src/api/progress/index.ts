import { ExecProgressRepository } from "../../exec-progress/models/repository"
import { runTime } from "../../helper"

export const getExecProgressOnCall = runTime.https.onCall(
    async (data) => {
        const execId = data.execId
        const execProgressRepository = new ExecProgressRepository()
        return execProgressRepository.getOne({execId})
    }
) 
 
