"use client";

import { useEffect, useState } from "react";
import getFavorite from "../../libs/getFavorite";
import { Favorites, User } from "../../interface";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import getMe from "../../libs/getMe";

export default function Home() {

  const [favorites, setFavorites] = useState<Favorites[] | []>([]);
  const [user, setUser] = useState<User | null>(null);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGI1NjBkNTBlZDJhYmQ5NTdkOWRjZiIsImlhdCI6MTc0NTU3MzM5MywiZXhwIjoxNzQ4MTY1MzkzfQ.U21DV3sNrfTTMpoyPwAT7CXxgPWlctpKPQMuzn1Z2Os";

  useEffect(() => {
    const fetchData = async () => {
      const fav = await getFavorite(token);
      console.log(fav);
      setFavorites(Array.isArray(fav) ? fav : [fav]);

      const userdata = await getMe(token);
      console.log(userdata);
      setUser(userdata);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card className="shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">User Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-base">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-base">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-base">{user?.tel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="text-base capitalize">{user?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">Favorite Hotels</h2>
          <Separator />
          {favorites.length > 0 ? (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <div
                  key={favorite.hotel._id}
                  className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold">{favorite.hotel.name}</h3>
                  <p className="text-sm text-muted-foreground">Province: {favorite.hotel.province}</p>
                  <p className="text-sm text-muted-foreground">Phone: {favorite.hotel.tel}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No favorite hotels found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
