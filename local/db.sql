CREATE DATABASE louvorappdb;

\c louvorappdb;

CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "uid" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) NOT NULL
);

CREATE TABLE "members" (
    "id" SERIAL PRIMARY KEY,
    "uid" VARCHAR(50) NOT NULL,
    "fk_user" INT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "dob" DATE NULL,
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) NOT NULL,
    CONSTRAINT "fk_members_users" FOREIGN KEY ("fk_user") REFERENCES "users" ("id")
);

CREATE TABLE "churches" (
    "id" SERIAL PRIMARY KEY,
    "uid" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) NOT NULL
);

CREATE TABLE "church_members" (
    "id" SERIAL PRIMARY KEY,
    "fk_church" INT NOT NULL,
    "fk_member" INT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) NOT NULL,
    CONSTRAINT "fk_church_members_members" FOREIGN KEY ("fk_member") REFERENCES "members" ("id"),
    CONSTRAINT "fk_church_members_churches" FOREIGN KEY ("fk_church") REFERENCES "churches" ("id")
);

CREATE TABLE "roles" (
    "id" SERIAL PRIMARY KEY,
    "uid" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) NOT NULL
);

CREATE TABLE "member_roles" (
    "id" SERIAL PRIMARY KEY,
    "fk_member" INT NOT NULL,
    "fk_role" INT NOT NULL,
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) NOT NULL,
    CONSTRAINT "fk_member_roles_members" FOREIGN KEY ("fk_member") REFERENCES "members" ("id"),
    CONSTRAINT "fk_member_roles_roles" FOREIGN KEY ("fk_role") REFERENCES "churches" ("id")
);

INSERT INTO "roles"("uid", "name", "description", "created_at", "updated_at")
VALUES('rl-baf99b5b-b749-4cc8-b822-77ed1e64fa40', 'Pastor', 'Líder espiritual da igreja', NOW(), NOW());

INSERT INTO "roles"("uid", "name", "description", "created_at", "updated_at")
VALUES('rl-baf99b5b-b749-4cc8-b822-77ed1e64fa41', 'Admin', 'Super usuário com acesso a todas as funcionalidades', NOW(), NOW());

INSERT INTO "roles"("uid", "name", "description", "created_at", "updated_at")
VALUES('rl-baf99b5b-b749-4cc8-b822-77ed1e64fa42', 'Membro', 'Membro comum', NOW(), NOW());
