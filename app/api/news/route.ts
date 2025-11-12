import { NextResponse } from "next/server"

export async function GET() {
  try {
    const params = new URLSearchParams({
      access_key: "58aecf82c1b2d8312eaf2b10587e02b2",
      categories: "business",
      languages: "en",
      countries: "us",
      limit: "5",
      sort: "published_desc",
    })

    const apiUrl = `https://api.mediastack.com/v1/news?${params.toString()}`
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      // Add cache control
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("MediaStack API Error:", response.status, errorText)
      return NextResponse.json(
        { error: `Failed to fetch news: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Check for API error in response
    if (data.error) {
      console.error("MediaStack API Error:", data.error)
      return NextResponse.json(
        { error: data.error.info || "API returned an error" },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in news API route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

