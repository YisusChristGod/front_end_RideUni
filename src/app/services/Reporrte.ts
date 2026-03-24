import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Reporte } from "../models/Reporte";

@Injectable({
    providedIn: "root",
})

export class ReporteService {
    private apiUrl = "https://localhost:7008/api/Reporte";

    constructor(private http: HttpClient) {}

    getReporte() {
        return this.http.get<Reporte[]>(this.apiUrl);
    }

    insertReporte(reporte: Reporte) {
        return this.http.post(this.apiUrl, reporte);
    }

    getReporteById(id: number) {
        return this.http.get<Reporte>(`${this.apiUrl}/${id}`);
    }

    updateReporte(id: number, reporte: Reporte) {
        return this.http.put(`${this.apiUrl}/${id}`, reporte);
    }

    deleteReporte(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}