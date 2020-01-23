class GamesController < ApplicationController

  def index
    if !params[:sort]
      @games = Game.order("created_at DESC").page(params[:page]).per(5)
      respond_to do |format|
        format.html
        format.js
      end
    else
      @games = Game.where(cell: params[:sort]).order("created_at DESC").page(params[:page]).per(5)
        respond_to do |format|
          format.html
          format.js
        end
    end
  end

  def easy
    render 'play'
  end

  def normal
    render 'play'
  end

  def hard
    render 'play'
  end

  def hell
    render 'play'
  end

  def new
    gon.question = Game.new(cell_params)
    render 'create'
  end

  def create
    gon.question = Game.new(create_params)
    if gon.question.save
      flash[:notice] = 'Creation successed.'
      redirect_to root_path
    else
      flash[:notice] = 'Creation failed.'
      redirect_to root_path
    end
  end

  def show
    gon.created = Game.find(params[:id])
    render 'play'
  end

  private

  def cell_params
    params.permit(:cell)
  end

  def create_params
    params.permit(:name, :cell, :xuji, :position)
  end

end