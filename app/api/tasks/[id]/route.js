import { PrismaClient } from '@prisma/client';

import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET(request,{params}){
    const id = parseInt(params.id)
    try{
       const UniqTasks = await prisma.task.findUnique({
        where: {
            id:id,
        }
       });
       return NextResponse.json(UniqTasks);
    }catch(err){
       console.log("Error Fetching Users",err);
       return NextResponse.error("Internal Server Error",500);
    }
 }

 export async function PUT(request,{params}){
    const id = parseInt(params.id)
    try{
        const data = await request.json();
        const {title,description,dueDate} = data;
         const id  = parseInt(params.id)
        const UpdateTask = await prisma.task.update({
            where:{id},
          data: {
            title,
            description,
            dueDate:new Date(),
          },
        })
       
           return NextResponse.json(UpdateTask);
   
    }catch(err){
       console.log("Error Fetching Users",err);
       return NextResponse.error("Internal Server Error",500);
    }
 }
//Delete api
 export async function DELETE(request,{params}){
    const id = parseInt(params.id)
    try{
       
        const DeleteTask = await prisma.task.delete({
            where:{id},
          
        })
       
           return NextResponse.json(DeleteTask);
   
    }catch(err){
       console.log("Error Fetching Users",err);
       return NextResponse.error("Internal Server Error",500);
    }
 }

 