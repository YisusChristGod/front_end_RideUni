import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Camion } from "../models/Camion";

@Injectable({
    providedIn: "root",
})

export class CamionService {
    private apiUrl = "https://localhost:7008/api/Camion";

    constructor (private http: HttpClient) {}

    getCamion() {
        return this.http.get<Camion[]>(this.apiUrl);
    }

    insertCamion(camion: Camion) {
        return this.http.post(this.apiUrl, camion);
    }

    
}