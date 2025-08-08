import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";

export interface PostAttributes {
  id: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  authorId: number;
}

export interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}

export class Post extends Model<PostAttributes, PostCreationAttributes> {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    authorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: "posts"
  }
);