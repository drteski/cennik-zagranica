import { config } from "@/config/config";

export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { createWriteStream, createReadStream } from "fs";
import { createInterface } from "readline";
import convert from "xml-js";
import axios from "axios";
import { pipeline } from "stream";

import { promisify } from "util";
import xml2js from "xml2js";
const parserXML = new xml2js.Parser({ attrkey: "ATTR" });
// https://lazienka-rea.com.pl/feed/generate/full_offer
export async function GET() {
  const p = promisify(pipeline);
  try {
    const request = await axios.get("https://files.lazienka-rea.com.pl/feed-small.xml", {
      responseType: "stream",
    });
    await p(request.data, createWriteStream(`${process.cwd().replace(/\\/g, "/")}/public/temp/feed.xml`, { flags: "w" }));
    console.log("Download successful!");
  } catch (error) {
    console.error("Download failed.", error);
  }

  // Before inserting, remove category names and product titles to avoid duplicates
  await prisma.categoryName.deleteMany({});

  // Strings are too short for gigantic XMLs
  let data = [];

  const fileStream = createReadStream(`${process.cwd().replace(/\\/g, "/")}/public/temp/feed.xml`);

  const lineReader = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of lineReader) {
    data.push(line.trim());
  }

  console.log(data);

  return NextResponse.json({ message: "Zaktualizowano produkty." });
}
