import { $Enums } from "../generated/prisma"

export const users = [
    {
        username : "petugas",
        email : "petugas@wisuda.com",
        password  : "password123",
        role : $Enums.userRole.PETUGAS
    },
    {
        username : "bukuWisuda",
        email : "bukuwisuda@wisuda.com",
        password  : "password123",
        role : $Enums.userRole.BUKUWISUDA
    },
    {
        username : "sekretariat",
        email : "sekretariat@wisuda.com",
        password  : "password123",
        role : $Enums.userRole.SEKRETARIAT
    },
    {
        username : "superadmin",
        email : "superadmin@wisuda.com",
        password  : "password123",
        role : $Enums.userRole.SUPERADMIN
    },
]

