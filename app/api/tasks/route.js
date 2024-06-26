import { PrismaClient } from '@prisma/client';

import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export  async function POST(request) {
  
   try{
    const data = await request.json();
 const {title,description,dueDate} = data;
  
 const newtask = await prisma.task.create({
   data: {
     title,
     description,
     dueDate:new Date(dueDate),
   },
 })

    return NextResponse.json(newtask);
   }
   catch(err){
    console.log(err);
    return NextResponse.error("Internal Server Error",500);
   }
  
}

export async function GET(){
   try{
      const allTasks = await prisma.task.findMany();
      return NextResponse.json(allTasks);
   }catch(err){
      console.log("Error Fetching Users",err);
      return NextResponse.error("Internal Server Error",500);
   }
}