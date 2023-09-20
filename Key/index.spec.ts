import { authly } from "authly"
import { userwidgets } from "@userwidgets/model"
import { proquse } from "../index"

const now = new Date(Math.floor(new Date().getTime() / 1000) * 1000)
authly.Issuer.defaultIssuedAt = Math.floor(now.getTime() / 1000)
describe("Key", () => {
	const privateKey =
		"MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7VJTUt9Us8cKj" +
		"MzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvu" +
		"NMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ" +
		"qgtzJ6GR3eqoYSW9b9UMvkBpZODSctWSNGj3P7jRFDO5VoTwCQAWbFnOjDfH5Ulg" +
		"p2PKSQnSJP3AJLQNFNe7br1XbrhV//eO+t51mIpGSDCUv3E0DDFcWDTH9cXDTTlR" +
		"ZVEiR2BwpZOOkE/Z0/BVnhZYL71oZV34bKfWjQIt6V/isSMahdsAASACp4ZTGtwi" +
		"VuNd9tybAgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqasqskV" +
		"laAidgg/sWqpjXDbXr93otIMLlWsM+X0CqMDgSXKejLS2jx4GDjI1ZTXg++0AMJ8" +
		"sJ74pWzVDOfmCEQ/7wXs3+cbnXhKriO8Z036q92Qc1+N87SI38nkGa0ABH9CN83H" +
		"mQqt4fB7UdHzuIRe/me2PGhIq5ZBzj6h3BpoPGzEP+x3l9YmK8t/1cN0pqI+dQwY" +
		"dgfGjackLu/2qH80MCF7IyQaseZUOJyKrCLtSD/Iixv/hzDEUPfOCjFDgTpzf3cw" +
		"ta8+oE4wHCo1iI1/4TlPkwmXx4qSXtmw4aQPz7IDQvECgYEA8KNThCO2gsC2I9PQ" +
		"DM/8Cw0O983WCDY+oi+7JPiNAJwv5DYBqEZB1QYdj06YD16XlC/HAZMsMku1na2T" +
		"N0driwenQQWzoev3g2S7gRDoS/FCJSI3jJ+kjgtaA7Qmzlgk1TxODN+G1H91HW7t" +
		"0l7VnL27IWyYo2qRRK3jzxqUiPUCgYEAx0oQs2reBQGMVZnApD1jeq7n4MvNLcPv" +
		"t8b/eU9iUv6Y4Mj0Suo/AU8lYZXm8ubbqAlwz2VSVunD2tOplHyMUrtCtObAfVDU" +
		"AhCndKaA9gApgfb3xw1IKbuQ1u4IF1FJl3VtumfQn//LiH1B3rXhcdyo3/vIttEk" +
		"48RakUKClU8CgYEAzV7W3COOlDDcQd935DdtKBFRAPRPAlspQUnzMi5eSHMD/ISL" +
		"DY5IiQHbIH83D4bvXq0X7qQoSBSNP7Dvv3HYuqMhf0DaegrlBuJllFVVq9qPVRnK" +
		"xt1Il2HgxOBvbhOT+9in1BzA+YJ99UzC85O0Qz06A+CmtHEy4aZ2kj5hHjECgYEA" +
		"mNS4+A8Fkss8Js1RieK2LniBxMgmYml3pfVLKGnzmng7H2+cwPLhPIzIuwytXywh" +
		"2bzbsYEfYx3EoEVgMEpPhoarQnYPukrJO4gwE2o5Te6T5mJSZGlQJQj9q4ZB2Dfz" +
		"et6INsK0oG8XVGXSpQvQh3RUYekCZQkBBFcpqWpbIEsCgYAnM3DQf3FJoSnXaMhr" +
		"VBIovic5l0xFkEHskAjFTevO86Fsz1C2aSeRKSqGFoOQ0tmJzBEs1R6KqnHInicD" +
		"TQrKhArgLXX4v3CddjfTRJkFWDbE/CkvKZNOrcf1nhaGCPspRJj2KUkj1Fhl9Cnc" +
		"dn/RsYEONbwQSjIfMPkvxF+8HQ=="
	const publicKey =
		"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo" +
		"4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u" +
		"+qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh" +
		"kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ" +
		"0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg" +
		"cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc" +
		"mwIDAQAB"
	const creatable: proquse.Key.Creatable = {
		name: { first: "jessie", last: "doe" },
		email: "jessie@example.com",
		permissions:
			"*.org *.payhemt.expense *.delegation *.app.view a1b2c3d4.org a1b2c3d4.payment.expense a1b2c3d4.delegation",
	}
	const key: proquse.Key = {
		...(({ permissions, ...creatable }) => creatable)(creatable),
		audience: "issuefab",
		expires: "2023-08-19T00:25:25.000Z",
		issued: "2023-08-18T12:08:21.000Z",
		issuer: "userwidgets",
		permissions: {
			"*": {
				org: true,
				payment: { expense: true },
				delegation: true,
				app: {
					view: true,
				},
			},
			a1b2c3d4: {
				org: true,
				payment: { expense: true },
				delegation: true,
			},
		},
		token:
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1c2Vyd2lkZ2V0cyIsImlhdCI6MTY5MjM2MTUyNSwiYXVkIjoiaXNzdWVmYWIiLCJleHAiOjE2OTI0MDQ3MjUsIm5hbSI6eyJmaXJzdCI6Implc3NpZSIsImxhc3QiOiJkb2UifSwic3ViIjoiamVzc2llQGV4YW1wbGUuY29tIiwicGVyIjoiKi5vcmcgKi5wYXltZW50LmV4cGVuc2UgKi5kZWxlZ2F0aW9uICouYXBwLnZpZXcgYTFiMmMzZDQub3JnIGExYjJjM2Q0LnBheW1lbnQuZXhwZW5zZSBhMWIyYzNkNC5kZWxlZ2F0aW9uIn0.irrOnQOKWlG5TcD1PxBCbiVFQYhMVbueKvtvFyBIy8ueEGftgvltCNhBfW3cx0AJunSP-f6rQwjPFU4huWQlo54UDOTXk7AX6igLDSThB44W-eRCUGHclid_67KIwsq7c5uVqWAbb4UMLILWHMg8ooYafKpeCtjlfLNNRTlYHduZz1dLQSoPqJR40Jpl0UmfKMGXXP-OXQH9cStKg2ZY9L76prhFcH1wTcCFp4-1GjpxI8Ewd-O_djpkRJ8OJCq07X7BckJAyOOo2dV5dOZW9Bb-0ncfKKNDmY2qnhw3jHWO8R5HF0yvkUF05edh_7uE57dPM3vqpspHkfoU_VvORQ",
	}
	it("is", () => {
		expect(proquse.Key.is(key)).toEqual(true)
		expect(proquse.Key.is((({ issuer, ...key }) => key)(key))).toEqual(false)
		expect(proquse.Key.Creatable.type.get(key)).toEqual(undefined)
		expect(proquse.Key.type.get(key)).toEqual(key)
		expect(proquse.Key.type.get((({ issuer, ...key }) => key)(key))).toEqual(undefined)
	})
	it("signing and verifying", async () => {
		const issuer = userwidgets.User.Key.Issuer.create("userwidgets", "proquse", publicKey, privateKey)
		const token = await issuer.sign(creatable, now.getTime() / 1000)
		if (token == undefined) {
			expect(token).not.toEqual(undefined)
			return
		}
		const verifier = proquse.Key.Verifier.create(publicKey)
		const key = await verifier.verify(token)
		if (key == undefined) {
			expect(key).not.toEqual(undefined)
			return
		}
		expect(proquse.Key.is(key))
	})
})
