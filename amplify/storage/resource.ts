import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
    name: "aws-ug-bsb-assets",
    // Regra simples: guest pode ler, autenticado pode ler e escrever
    access: (allow) => ({
        "public/profile-pictures/{entity_id}/*": [
            allow.guest.to(["read"]),
            // Usuário pode ler, escrever e deletar a própria foto de perfil
            allow.entity("identity").to(["read", "write", "delete"])
        ],
        "public/assets/*": [
            allow.guest.to(["read"]),
            // Controlaremos o upload dos autenticados através de route guards para acesso baseado em permissão.
            // Admins: podem fazer upload de imagens de eventos | Usuário: pode modificar a própria foto de perfil
            allow.groups(["ADMINS"]).to(["read", "write", "delete"])
        ]
    })
})
