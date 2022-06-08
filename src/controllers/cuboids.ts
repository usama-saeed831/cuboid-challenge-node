import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { Id } from 'objection';
import cuboid from '../factories/cuboid';
import { Cuboid } from '../models';
import { Bag } from '../models';

export const list = async (req: Request, res: Response): Promise<Response> => {
  const ids = req.query.ids as Id[];
  const cuboids = await Cuboid.query().findByIds(ids).withGraphFetched('bag');

  return res.status(200).json(cuboids);
};

export const get = async (req: Request, res: Response): Promise<Response> =>{
  const id: Id = req.params.id;
  const cuboid = await Cuboid.query().findById(id).withGraphFetched('bag');
  if (!cuboid) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
  cuboid.volume = cuboid.width * cuboid.height * cuboid.depth
  return res.status(200).json(cuboid);
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { width, height, depth, bagId } = req.body;

  let bag_id = req.body.bagId;
  const bagData = await Bag.query().findById(bag_id).withGraphFetched('cuboids');;
  if(!bagData){
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
  if(bagData?.cuboids?.length){
    let totalVolume: number = width * height * depth;
    bagData.cuboids.map((cube:any)=>{
      totalVolume = totalVolume + (cube.width * cube.height * cube.depth)
    })
    if(totalVolume > bagData.volume){
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({message:'Insufficient capacity in bag'});
    }
  }

  const cuboid = await Cuboid.query().insert({
    width,
    height,
    depth,
    bagId,
  });

  return res.status(HttpStatus.CREATED).json(cuboid);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const { width, height, depth, bagId } = req.body;

  const bagData = await Bag.query().findById(bagId).withGraphFetched('cuboids');;
  if(!bagData){
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
  if(bagData?.cuboids?.length){
    let dataToUpdateIndex = bagData.cuboids.findIndex(objF => objF.id == id);
    bagData.cuboids.splice(dataToUpdateIndex,1)
    let cuboidVolume: number = 0;
    bagData.cuboids.map((cube:any)=>{
      cuboidVolume = cuboidVolume + (cube.width * cube.height * cube.depth)
    })
    let insertedCubeVolume = height*width*depth;
    if(cuboidVolume + insertedCubeVolume > bagData.volume){
      console.log("dslfaks");
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({message:'Insufficient capacity in bag'});
    }
  }

  await Cuboid.query().findById(id).patch({
    width,
    height,
    depth
  })
  const cuboidAfterUpdate = await Cuboid.query().findById(id).withGraphFetched('bag');

  return res.status(HttpStatus.OK).json(cuboidAfterUpdate);
};

export const deleteCuboid = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const deletedCuboid = await Cuboid.query().deleteById(id);
  return res.sendStatus(deletedCuboid ? HttpStatus.OK : HttpStatus.NOT_FOUND )
};