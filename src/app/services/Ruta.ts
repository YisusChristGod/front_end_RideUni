import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Ruta } from "../models/Ruta";

@Injectable({
    providedIn: "root",
})

export class RutaService {
    private apiUrl = "https://localhost:7008/api/Ruta";

    constructor(private http: HttpClient) {}

    getRuta() {
        return this.http.get<Ruta[]>(this.apiUrl);
    }

    insertRuta(ruta: Ruta) {
        return this.http.post(this.apiUrl, ruta);
    }

    getRutaById(id: number) {
        return this.http.get<Ruta>(`${this.apiUrl}/${id}`);
    }

    updateRuta(id: number, ruta: Ruta) {
        return this.http.put(`${this.apiUrl}/${id}`, ruta);
    }

    deleteRuta(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}