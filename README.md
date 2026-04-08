# Nadji Ekipu

Web aplikacija za povezivanje ljudi sa sličnim interesovanjima i organizovanje zajedničkih aktivnosti.

## Opis projekta

Nadji Ekipu je platforma koja omogućava korisnicima da pronađu ljude za različite aktivnosti, kao što su fudbal, košarka, šah, zajedničko učenje ...

Korisnici mogu:
- da pregledaju i kreiraju aktivnosti  
- da se prijave na postojeće događaje  
- da komuniciraju sa drugim učesnicima putem chata  

Cilj aplikacije je da olakša organizaciju i povezivanje ljudi sa sličnim interesovanjima.

## Tehnologije

- Frontend: React + Tailwind CSS  
- Backend: Python (Django)  
- Baza: MySQL  
- Eksterni API: OpenWeather API  

## Tipovi korisnika

### Registrovani korisnik
- pregled i prijava na aktivnosti  
- upravljanje interesovanjima  
- chat sa učesnicima  
- profil  

### Moderator
- sve kao korisnik  
- dodavanje i brisanje interesovanja  

### Administrator
- sve kao moderator  
- upravljanje korisnicima  
- odobravanje moderatora  
- pregled statistike  

## Funkcionalnosti

### Autentifikacija
- registracija korisnika  
- login/logout  
- autorizacija po ulogama  

### Interesovanja
- dodavanje i izmena interesovanja  
- skill level po interesovanju  

### Aktivnosti (događaji)
- kreiranje aktivnosti  
- prijava na aktivnosti  
- preporuke na osnovu interesovanja  
- filtriranje po vremenu i lokaciji  

### Pretraga
- pretraga aktivnosti  
- selekcija i filtriranje  

### Chat
- komunikacija između korisnika na istoj aktivnosti  
- chat se briše 24h nakon događaja  

### Profil
- pregled i izmena podataka  
- promena lozinke  
- pregled aktivnosti i interesovanja  

### Administracija
- upravljanje korisnicima  
- dodela moderatorskih prava  
- pregled statistike  

## Planirane funkcionalnosti

- integracija vremenske prognoze  
- preporuka aktivnosti (indoor/outdoor)  
- prikaz na mapi  
- napredni filteri  

## Checklist (progress tracker)
- [ ] nije u izradi
- [🟦] napravljeno u prototipu
- [🟨] uradjen ceo back ili front
- [🟩] funkcionalnost kompletirana

### Autentifikacija
- [ ] Registracija korisnika  
- [🟦] Login  
- [ ] Logout  
- [ ] Role-based autorizacija  

### Profil
- [🟦] Pregled profila  
- [ ] Izmena podataka  
- [🟦] Promena lozinke  

### Interesovanja
- [ ] Dodavanje interesovanja  
- [ ] Izmena interesovanja  
- [ ] Skill level  

### Aktivnosti
- [ ] Kreiranje aktivnosti  
- [ ] Prijava na aktivnost  
- [🟦] Prikaz aktivnosti  
- [ ] Preporučene aktivnosti  

### Pretraga i filteri
- [🟦] Pretraga po interesovanju
- [🟦] Filter po vremenu i datumu
- [🟦] Filter po lokaciji  

### Chat
- [ ] Chat između učesnika  
- [ ] Automatsko brisanje chata  

### Moderator
- [ ] Dodavanje interesovanja  
- [ ] Brisanje interesovanja  

### Administrator
- [ ] Pregled korisnika  
- [ ] Brisanje korisnika  
- [ ] Dodela moderatora  
- [ ] Pregled statistike  

### Napredno
- [ ] Integracija OpenWeather API  
- [ ] Preporuke po vremenu  
- [ ] Mapa aktivnosti  
- [ ] Napredni filteri  

## Pokretanje projekta

```bash
# frontend
npm install
npm run dev
```
