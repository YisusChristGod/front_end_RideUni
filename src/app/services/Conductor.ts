import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Conductor } from "../models/Conductor";

@Injectable({
    providedIn: "root",
})

export class ConductorService {
    private apiUrl = "https://localhost:7008/api/Conductor";

    constructor(private http: HttpClient) {}

    getConductor() {
        return this.http.get<Conductor[]>(this.apiUrl);
    }

    insertConductor(conductor: Conductor) {
        return this.http.post(this.apiUrl, conductor);
    }

    getConductorById(id: number) {
        return this.http.get<Conductor>(`${this.apiUrl}/${id}`);
    }

    updateConductor(id: number, conductor: Conductor) {
        return this.http.put(`${this.apiUrl}/${id}`, conductor);
    }

    deleteConductor(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
