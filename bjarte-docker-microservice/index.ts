import { z } from "zod"

// Types
type Path = '/flags'
type Method = 'GET' | 'PUT'
type ApiEndpoint = `${Method} ${Path}`

// Other types
const FeatureFlag = z.object({
    key: z.string().min(1),
    value: z.boolean()
})

type FeatureFlagType = z.infer<typeof FeatureFlag>

// Constants
const responseHeaders: Bun.HeadersInit = { 'Content-Type': 'application/json' }

// Custom classes
class CustomResponse extends Response {
    constructor(response: Record<any, any>, headerOverride?: Bun.ResponseInit) {
        super(JSON.stringify(response), { ...responseHeaders, ...headerOverride })
    }
}

console.log("Running bun server on")
console.log("http://localhost:3030")

Bun.serve({
    port: 3030,
    async fetch(req) {

        try {
            const url = new URL(req.url)
            const method = req.method

            const apiEndpoint: ApiEndpoint = `${method as Method} ${url.pathname as Path}`

            switch (apiEndpoint) {
                case 'PUT /flags': {

                    const request = await req.json() as FeatureFlagType

                    if (!FeatureFlag.safeParse(request).success) {
                        return new CustomResponse({ message: 'Bad Request' }, { status: 400 })
                    }

                    const featureFlagToInsert = {
                        [request.key]: request.value
                    }

                    let updatedFeatureFlagInfo = featureFlagToInsert

                    // write to file
                    try {
                        const featureFlagFile = Bun.file('feature_flags.json', { type: "application/json" })

                        if (await featureFlagFile.exists()) {
                            const featureFlagObject = JSON.parse(await featureFlagFile.text())
                            updatedFeatureFlagInfo = {
                                ...featureFlagObject,
                                ...updatedFeatureFlagInfo
                            }
                        }

                        Bun.write(featureFlagFile, JSON.stringify(updatedFeatureFlagInfo))
                    } catch (err) {
                        console.log(err)
                        return new CustomResponse({ message: 'Internal Server Error' }, { status: 500 })
                    }

                    return new CustomResponse({ message: `You called PUT /flags` }, { status: 200 })
                }
                case 'GET /flags':
                    return new CustomResponse({ message: `You called GET /flags` }, { status: 200 })
                default:
                    return new CustomResponse({ message: `You called ${apiEndpoint}, which I don't know how to handle!` }, { status: 404 })
            }
        } catch (err) {
            console.log(err)
            return new CustomResponse({ message: 'Internal Server Error' }, { status: 500 })
        }

    }
})
