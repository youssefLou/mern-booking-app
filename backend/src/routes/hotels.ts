import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = contructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

const contructSearchQuery = (queryParams: any) => {
  let contructedQuery: any = {};

  if (queryParams.destination) {
    contructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }
  if (queryParams.adultCount) {
    contructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }
  if (queryParams.childCount) {
    contructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    contructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    contructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    contructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    contructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }
  return contructedQuery;
};

export default router;
