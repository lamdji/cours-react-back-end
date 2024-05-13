# Serveur backend Blog posts

Un serveur en Javascript implémenté avec ExpressJS.

Le serveur permet:

- L'authentification
  - Inscription
  - Connexion
  - Mise a jour du profile
- Gestion de posts:
  - Créer un posts
  - Recuperer un post
  - Récuperer tous les posts
  - Récuperer tous les posts d'un utilisateur

## Installer les dépendances

Les package utillisé dans l'application sont:

- express

Afin d'installer les dépendances lister dans `package.json`, mettez vous dans le dossier l'application avec un terminal:

```bash
npm install
```

## Lancer l'application en mode developement

Afin de travailler sur l'application et avoir le rafraichissment lors des changement, vous pouvez lancer le serveur avec:

```bash
npm run dev
```

## Documentation

### Error Reponse

```ts
{
    "success":false,
    "data":{
        "errors":[
            {"message":string}
        ]
    }
}
```

### 1. Authentification

#### 1.1. Inscription

##### URL

```http
POST /api/users/register
```

##### Data

```ts
{
    "email":string,
    "username":string,
    "password":string
}
```

##### Réponse

```ts
{
    "success":true,
    "data":{
        "user":{
            "id": string,
            "email":string,
            "username":string,
            "password":string
        }
    }
}
```

---

#### 1.2. Connexion

##### URL

```http
POST /api/users/login
```

##### Data

```ts
{
    "email":string,
    "password":string
}
```

##### Réponse

```ts
{
    "success":true,
    "data":{
        "user":{
            "id":string,
            "email":string,
            "username":string,
            "avatarUrl": string
        },
        "access_token": string
    }
}
```

---

#### 1.3. Récuperer les données de l'utilisateur

##### URL

```http
POST /api/users/me
```

##### Cookies

```http
Authorization: 'Bearer XXXXXX'
```

##### Réponses

```ts
{
    "success":true,
    "data":{
        "user":{
            "id":string,
            "email":string,
            "username":string,
            "avatarUrl": string
        },
        "access_token": string
    }
}
```

---

#### 1.4. Mise à jour du profile

##### URL

```http
PATCH /api/users/me
```

##### Cookies

```http
Authorization: 'Bearer XXXXXX'
```

##### Data

```ts
{
    "username":string, //(Optional)
    "avatarUrl": string | undefined //(Optional)
}
```

##### Réponses

```ts
{
    "success":true,
    "data":{
        "user":{
            "id":string,
            "email":string,
            "username":string,
            "avatarUrl": string | undefined
        },
        "access_token": string
    }
}
```

---

### 2. Posts

#### 2.1 Créer un post

##### URL

```http
POST /api/posts/create
```

##### Cookies

```http
Authorization: 'Bearer XXXXXX'
```

##### Data

```ts
{
    "title":string,
    "description":string,
    "content":string,
    "imageUrl": string | undefined //(Optional)
}
```

##### Réponses

```ts
{
    "success":true,
    "data":{
        "post":{
            "title":string,
            "description":string,
            "content":string,
            "imageUrl": string | undefined
            "userID":string
        }
    }
}
```

---

#### 2.2 Récuperer un post

##### URL

```http
GET /api/posts/:id
```

##### Réponses

```ts
{
    "success":true,
    "data":{
        "post":{
            "title":string,
            "description":string,
            "content":string,
            "imageUrl": string | undefined
            "userID":string,
            "user":{
                "id":string,
                "email":string,
                "username":string | undefined,
                "avatarUrl": string | undefined
            }
        }
    }
}
```

#### 2.2 Récuperer tous les posts

##### URL

```http
GET /api/posts
```

##### Réponses

```ts
{
    "success":true,
    "data":[
        "posts":{
            "title":string,
            "description":string,
            "content":string,
            "imageUrl": string | undefined
            "userID":string,
            "user":{
                "id":string,
                "email":string,
                "username":string | undefined,
                "avatarUrl": string | undefined
            }
        },
        // ...
    ]
}
```

---

#### 2.3 Récuperer tous les posts d'un utilisateur

##### URL

```http
GET /api/users/:id/posts
```

##### Réponses

```ts
{
    "success":true,
    "data":[
        "posts":{
            "title":string,
            "description":string,
            "content":string,
            "imageUrl": string | undefined
            "userID":string,
        },
        // ...
    ]
}
```

---

#### 2.4. Récuperer tous les posts de l'utilisateur connecté

##### URL

```http
GET /api/users/me/posts
```

##### Cookies

```http
Authorization: 'Bearer XXXXXX'
```

##### Réponses

```ts
{
    "success":true,
    "data":[
        "posts":{
            "title":string,
            "description":string,
            "content":string,
            "imageUrl": string | undefined
            "userID":string,
        },
        // ...
    ]
}
```
