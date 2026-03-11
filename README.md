# DT210G - Projekt backend
Repot innehåller källkod för ett API som hanterar spelrecensioner. API:et bygger på ett externt API, (https://www.freetogame.com/api-doc)[FreeToGame]. När ett spel från FreeToGame recenseras, lagras recensionerna med det externa id:et. På så vis kan information om ett spel hämtas tillsammans med tillhörande recensioner.

Detta API hanterar, utöver recensioner, spels genomsnitts poäng, användare och personliga listor med sparade spel. API:et använder Jsonwebtoken för autentisering och Mongoose med MongoDB för lagring av datan.

## Router för användare
|Metod             |Endpoint           |Beskrivning                             |Autentisering          |Övrigt                 |
|------------------|-------------------|----------------------------------------|-----------------------|-----------------------|
|POST              |/user/register     |Skapar ny användare                     |Nej                    |                       |  
|POST              |/user/login        |Loggar in användare                     |Nej                    |                       | 
|PUT               |/profile           |Uppdaterar lösenord                     |Ja                     |                       | 
|GET               |/profile           |Hämtar användarinfo                     |Ja                     |                       | 
|GET               |/profile/reviews   |Hämtar användarens delade recensioner   |Ja                     |                       | 
|GET               |/validate          |Validerar token                         |//                     |                       |

Vid hämtning av specifika spel kan jwt-token skickas med för inloggade användare. På så vis anges om spel är sparade i användarens lista eller inte. Skickas token inte med är default _false_.

### POST - Registrering och inloggning
För att registrera en användare skickas JSON-objekt i följande format:
```json
{
  "username": "exempel12",
  "displayName": "gameboy12",
  "password": "lösenord12"
}
```

_displayName_ kan användas som det namn som är synligt för andra användare, medan username är ett säkert användarnamn som används vid inloggning. För att logga in skickas endast username och password.

### PUT - Byte av lösenord
För att uppdatera lösenordet skickas ett JSON-objekt i följande format:
```json
{
    "password": "lösenord12",
    "newPassword": "nyttlösen12"
}
```

## Router för spel
|Metod             |Endpoint           |Beskrivning             |Autentisering          |Övrigt                               |
|------------------|-------------------|------------------------|-----------------------|-------------------------------------|
|GET               |/games             |Hämtar samtliga spel    |Nej                    |Tar query för kategori och plattform |
|GET               |/games/{id}        |Hämtar specifikt spel   |Nej                    |Tar spelets siffer id                |  

Vid hämtning av samtliga spel med GET, kan även queries för plattformer och kategorier skickas med. För att filtrera på kategori och plattform kan exempelvis följande queries användas:
_/games?platform=pc&category=mmorpg_

**Plattformer**
_/games?platform=pc_
* pc
* browser
* all

**Kategorier**
_/games?category=mmorpg_
* mmorpg
* shooter
* strategy
* moba
* racing
* sports
* social
* sandbox
* open-world
* survival
* pvp
* pve
* pixel
* voxel
* zombie
* turn-based
* first-person
* third-Person
* top-down
* tank
* space
* sailing
* side-scroller
* superhero
* permadeath
* card
* battle-royale
* mmo
* mmofps
* mmotps
* 3d
* 2d
* anime
* fantasy
* sci-fi
* fighting
* action-rpg
* action
* military
* martial-arts
* flight
* low-spec
* tower-defense
* horror
* mmorts

## Router för recensioner
|Metod             |Endpoint                |Beskrivning             |Autentisering          |Övrigt                 |
|------------------|------------------------|------------------------|-----------------------|-----------------------|
|POST              |/games/reviews          |Lägger till recension   |Ja                     |Tar spelets siffer id  |
|PUT               |/games/reviews/{id}     |Uppdaterar recension    |Ja                     |Tar recensionens id    |
|DELETE            |/games/reviews/{id}     |Tar bort recension      |Ja                     |Tar recensionens id    |

För att skapa, eller redigera, en recension skickas ett JSON-objekt enligt följande struktur:
```json
{
  "rating": 4,
  "title": "Bra spel",
  "description": "Riktigt roligt spel! Har spelat det non-stop i en vecka nu."
}
```

Rating är en betygsättning mellan 1-5. När ett nytt betyg sätts, räknas spelets genomsnitts poäng ut på nytt.


## Router för lista med sparade spel
|Metod             |Endpoint                |Beskrivning                     |Autentisering          |Övrigt                 |
|------------------|------------------------|--------------------------------|-----------------------|-----------------------|
|GET               |/saved                  |Hämtar lista med sparade spel   |Ja                     |                       |
|POST              |/saved/{id}             |Sparar spel i listan            |Ja                     |Tar spelets siffer id  |
|DELETE            |/saved/{id}             |Tar bort spel från listan       |Ja                     |Tar spelets siffer id  |


__Kim Dudenhöfer, 2026-03-11__
