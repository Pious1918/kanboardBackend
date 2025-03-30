import { FilterQuery, Model, UpdateQuery } from "mongoose";


export class BaseRepository<T extends Document> {

    private _model: Model<T>

    constructor(model: Model<T>) {
        this._model = model
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this._model.findOne(filter)
    }

    async find(filter?: Partial<T> | undefined): Promise<T[]> {
        return this._model.find()
    }


    async save(item: Partial<T>): Promise<T | null> {
        const newItem = new this._model(item)
        return await newItem.save()
    }


    public async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
        return await this._model.findOneAndUpdate(filter, update, { new: true });
    }

    public async deleteOne(filter: FilterQuery<any>) {
        return await this._model.findOneAndDelete(filter);
    }


    async updateById(id:any, updatedData:any) {
        return await this._model.findByIdAndUpdate(id, updatedData, { new: true });
    }
}