import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Horario } from "../models/Horario";

@Injectable({
    providedIn: "root",
})

export class HorarioService {
    private apiUrl = "https://localhost:7008/api/Horario";

    constructor(private http: HttpClient) {}

    getHorario() {
        return this.http.get<Horario[]>(this.apiUrl);
    }

    insertHorario(horario: Horario) {
        return this.http.post(this.apiUrl, horario);
    }

    getHorarioById(id: number) {
        return this.http.get<Horario>(`${this.apiUrl}/${id}`);
    }

    updateHorario(id: number, horario: Horario) {
        return this.http.put(`${this.apiUrl}/${id}`, horario);
    }

    deleteHorario(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}