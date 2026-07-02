import type { StatResponse } from "../types/stats";
import api from "./api";

const getStats = async (): Promise<StatResponse> => {
    const response = await api.get<StatResponse>(
        "/api/sessions/stats"
    )
    return response.data
}

export default getStats;